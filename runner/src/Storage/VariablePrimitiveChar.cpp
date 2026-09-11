#include "VariablePrimitiveChar.h"

namespace Storage {
VariablePrimitiveChar::VariablePrimitiveChar(char value)
{
  this->value = value;
}

VariablePrimitiveChar::VariablePrimitiveChar(val value)
{
  this->value = value.as<char>();
}

const val VariablePrimitiveChar::raw() const
{
  auto result = val::object();
  result.set("type", this->IsType);
  result.set("data", val(this->value));

  return result;
}

char VariablePrimitiveChar::get_value() const
{
  return this->value;
}
}
