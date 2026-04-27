from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from .. import db
from ..models import Todo
from ..schemas import todo_schema, todos_schema

todos_bp = Blueprint("todos", __name__)


# ──────────────────────────────────────────
# GET /api/todos  — list all (optional filter)
# ──────────────────────────────────────────
@todos_bp.route("/todos", methods=["GET"])
def get_todos():
    status = request.args.get("status")  # "active" | "completed"
    query = Todo.query.order_by(Todo.created_at.desc())

    if status == "active":
        query = query.filter_by(is_completed=False)
    elif status == "completed":
        query = query.filter_by(is_completed=True)

    todos = query.all()
    return jsonify(todos_schema.dump(todos)), 200


# ──────────────────────────────────────────
# GET /api/todos/<id>
# ──────────────────────────────────────────
@todos_bp.route("/todos/<int:todo_id>", methods=["GET"])
def get_todo(todo_id):
    todo = Todo.query.get_or_404(todo_id)
    return jsonify(todo_schema.dump(todo)), 200


# ──────────────────────────────────────────
# POST /api/todos  — create
# ──────────────────────────────────────────
@todos_bp.route("/todos", methods=["POST"])
def create_todo():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"error": "No input data provided"}), 400

    try:
        data = todo_schema.load(json_data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 422

    todo = Todo(**data)
    db.session.add(todo)
    db.session.commit()
    return jsonify(todo_schema.dump(todo)), 201


# ──────────────────────────────────────────
# PUT /api/todos/<id>  — update / toggle
# ──────────────────────────────────────────
@todos_bp.route("/todos/<int:todo_id>", methods=["PUT"])
def update_todo(todo_id):
    todo = Todo.query.get_or_404(todo_id)
    json_data = request.get_json()
    if not json_data:
        return jsonify({"error": "No input data provided"}), 400

    try:
        data = todo_schema.load(json_data, partial=True)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 422

    for key, value in data.items():
        setattr(todo, key, value)

    db.session.commit()
    return jsonify(todo_schema.dump(todo)), 200


# ──────────────────────────────────────────
# DELETE /api/todos/<id>
# ──────────────────────────────────────────
@todos_bp.route("/todos/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    todo = Todo.query.get_or_404(todo_id)
    db.session.delete(todo)
    db.session.commit()
    return jsonify({"message": "Todo deleted successfully"}), 200


# ──────────────────────────────────────────
# GET /api/stats  — dashboard counts
# ──────────────────────────────────────────
@todos_bp.route("/stats", methods=["GET"])
def get_stats():
    total = Todo.query.count()
    completed = Todo.query.filter_by(is_completed=True).count()
    active = total - completed
    high = Todo.query.filter_by(priority="high", is_completed=False).count()
    medium = Todo.query.filter_by(priority="medium", is_completed=False).count()
    low = Todo.query.filter_by(priority="low", is_completed=False).count()

    return jsonify({
        "total": total,
        "completed": completed,
        "active": active,
        "priority": {"high": high, "medium": medium, "low": low},
    }), 200
