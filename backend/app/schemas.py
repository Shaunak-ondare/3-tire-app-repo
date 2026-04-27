from marshmallow import Schema, fields, validate, validates, ValidationError


VALID_PRIORITIES = ["low", "medium", "high"]


class TodoSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=200, error="Title must be 1-200 characters."),
    )
    description = fields.Str(load_default=None, allow_none=True)
    priority = fields.Str(
        load_default="medium",
        validate=validate.OneOf(VALID_PRIORITIES, error="Priority must be low, medium, or high."),
    )
    category = fields.Str(load_default="General", validate=validate.Length(max=50))
    is_completed = fields.Bool(load_default=False)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


todo_schema = TodoSchema()
todos_schema = TodoSchema(many=True)
