#include "VariablePrimitiveLong.h"

namespace Storage {
VariablePrimitiveLong::VariablePrimitiveLong(long value)
{
  this->value = value;
}

VariablePrimitiveLong::VariablePrimitiveLong(val value)
{
  this->value = value.as<long>();
}

const val VariablePrimitiveLong::raw() const
{
  return val(this->value);
}

long VariablePrimitiveLong::get_value() const
{
  return this->value;
}
}
