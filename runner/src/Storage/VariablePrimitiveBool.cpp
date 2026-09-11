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

const val VariablePrimitiveBool::raw() const
{
  auto result = val::object();
  result.set("type", this->IsType);
  result.set("data", val(this->value));

  return result;
}

bool VariablePrimitiveBool::get_value() const
{
  return this->value;
}
}
