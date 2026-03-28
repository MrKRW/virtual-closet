"""
outfits_routes.py
-----------------
Add these routes to your existing Flask/FastAPI backend.
Handles server-side outfit persistence so outfits sync across devices.

Install if not already present:
    pip install flask flask-cors

Usage — add to your main app file:
    from outfits_routes import outfits_bp
    app.register_blueprint(outfits_bp, url_prefix='/api')
"""

import json
import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify

outfits_bp = Blueprint('outfits', __name__)

# ── In-memory store (replace with your DB — SQLite / PostgreSQL / Supabase) ──
_outfits_db: dict[str, list] = {}  # keyed by user_id


def _get_user_outfits(user_id: str) -> list:
    return _outfits_db.get(user_id, [])


def _save_user_outfits(user_id: str, outfits: list):
    _outfits_db[user_id] = outfits


# ── GET /api/outfits ─────────────────────────────────────────────────────────
@outfits_bp.route('/outfits', methods=['GET'])
def get_outfits():
    """
    Returns all saved outfits for a user.
    Query param: ?user_id=<id>
    """
    user_id = request.args.get('user_id', 'default')
    outfits = _get_user_outfits(user_id)
    return jsonify({'outfits': outfits, 'count': len(outfits)}), 200


# ── POST /api/outfits ────────────────────────────────────────────────────────
@outfits_bp.route('/outfits', methods=['POST'])
def create_outfit():
    """
    Saves a new outfit.
    Body: { user_id, name, occasion, notes, slots }
    slots = { headwear, top, outerwear, bottom, footwear, accessory }
    Each slot value is either null or a ClothingItem object.
    """
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    required = ['name', 'slots']
    for field in required:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400

    user_id = data.get('user_id', 'default')
    outfit = {
        'id': f'outfit_{uuid.uuid4().hex[:12]}',
        'name': data['name'].strip(),
        'occasion': data.get('occasion', ''),
        'notes': data.get('notes', ''),
        'slots': data['slots'],
        'createdAt': datetime.utcnow().isoformat() + 'Z',
        'wornCount': 0,
        'lastWorn': None,
    }

    outfits = _get_user_outfits(user_id)
    outfits.insert(0, outfit)
    _save_user_outfits(user_id, outfits)

    return jsonify({'outfit': outfit}), 201


# ── PATCH /api/outfits/<outfit_id>/worn ─────────────────────────────────────
@outfits_bp.route('/outfits/<outfit_id>/worn', methods=['PATCH'])
def mark_worn(outfit_id: str):
    """
    Increments wornCount and updates lastWorn timestamp.
    Body: { user_id }
    """
    data = request.get_json() or {}
    user_id = data.get('user_id', 'default')

    outfits = _get_user_outfits(user_id)
    updated = False

    for outfit in outfits:
        if outfit['id'] == outfit_id:
            outfit['wornCount'] = outfit.get('wornCount', 0) + 1
            outfit['lastWorn'] = datetime.utcnow().isoformat() + 'Z'
            updated = True
            break

    if not updated:
        return jsonify({'error': 'Outfit not found'}), 404

    _save_user_outfits(user_id, outfits)
    return jsonify({'success': True}), 200


# ── PATCH /api/outfits/<outfit_id> ──────────────────────────────────────────
@outfits_bp.route('/outfits/<outfit_id>', methods=['PATCH'])
def update_outfit(outfit_id: str):
    """
    Updates outfit name, occasion, notes, or slots.
    Body: { user_id, name?, occasion?, notes?, slots? }
    """
    data = request.get_json() or {}
    user_id = data.get('user_id', 'default')

    outfits = _get_user_outfits(user_id)
    updated = False

    for outfit in outfits:
        if outfit['id'] == outfit_id:
            for field in ['name', 'occasion', 'notes', 'slots']:
                if field in data:
                    outfit[field] = data[field]
            updated = True
            break

    if not updated:
        return jsonify({'error': 'Outfit not found'}), 404

    _save_user_outfits(user_id, outfits)
    return jsonify({'success': True}), 200


# ── DELETE /api/outfits/<outfit_id> ─────────────────────────────────────────
@outfits_bp.route('/outfits/<outfit_id>', methods=['DELETE'])
def delete_outfit(outfit_id: str):
    """
    Deletes an outfit by ID.
    Query param: ?user_id=<id>
    """
    user_id = request.args.get('user_id', 'default')
    outfits = _get_user_outfits(user_id)
    filtered = [o for o in outfits if o['id'] != outfit_id]

    if len(filtered) == len(outfits):
        return jsonify({'error': 'Outfit not found'}), 404

    _save_user_outfits(user_id, filtered)
    return jsonify({'success': True, 'deleted': outfit_id}), 200


# ── GET /api/outfits/stats ───────────────────────────────────────────────────
@outfits_bp.route('/outfits/stats', methods=['GET'])
def get_outfit_stats():
    """
    Returns wardrobe stats: most worn outfit, outfit counts by occasion, etc.
    Query param: ?user_id=<id>
    """
    user_id = request.args.get('user_id', 'default')
    outfits = _get_user_outfits(user_id)

    if not outfits:
        return jsonify({'stats': {}}), 200

    most_worn = max(outfits, key=lambda o: o.get('wornCount', 0))
    occasion_counts: dict = {}
    for o in outfits:
        occ = o.get('occasion') or 'Untagged'
        occasion_counts[occ] = occasion_counts.get(occ, 0) + 1

    stats = {
        'total_outfits': len(outfits),
        'total_wears': sum(o.get('wornCount', 0) for o in outfits),
        'most_worn': most_worn,
        'occasion_breakdown': occasion_counts,
    }

    return jsonify({'stats': stats}), 200