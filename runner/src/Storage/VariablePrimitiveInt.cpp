#include "VariablePrimitiveInt.h"

namespace Storage {
VariablePrimitiveInt::VariablePrimitiveInt(int value)
{
  this->value = value;
}

VariablePrimitiveInt::VariablePrimitiveInt(val value)
{
  this->value = value.as<int>();
}

const val VariablePrimitiveInt::raw() const
{
  auto result = val::object();
  result.set("type", this->IsType);
  result.set("data", val(this->value));

  return result;
}

int VariablePrimitiveInt::get_value() const
{
  return this->value;
}
}
