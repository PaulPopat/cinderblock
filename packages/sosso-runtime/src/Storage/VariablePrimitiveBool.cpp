#include "VariablePrimitiveBool.h"

namespace Storage {
VariablePrimitiveBool::VariablePrimitiveBool(bool value)
{
  this->value = value;
}

VariablePrimitiveBool::VariablePrimitiveBool(val value)
{
  this->value = value.as<bool>();
}

bool VariablePrimitiveBool::get_bool() const
{
  return this->value;
}

const val VariablePrimitiveBool::raw() const
{
  auto result = val::object();
  result.set("type", this->get_type_name());
  result.set("data", val(this->value));

  return result;
}

bool VariablePrimitiveBool::get_value() const
{
  return this->value;
}

const Variable* VariablePrimitiveBool::operate_and(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value && right->get_bool());
}

const Variable* VariablePrimitiveBool::operate_equals(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value == right->get_bool());
}

const Variable* VariablePrimitiveBool::operate_not_equals(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value != right->get_bool());
}

const Variable* VariablePrimitiveBool::operate_or(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value || right->get_bool());
}
}
