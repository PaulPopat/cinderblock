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
  return val(this->value);
}

int VariablePrimitiveInt::get_value() const
{
  return this->value;
}
}
