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
  result.set("type", this->get_type_name());
  result.set("data", val(this->value));

  return result;
}

int VariablePrimitiveInt::get_value() const
{
  return this->value;
}

char VariablePrimitiveInt::get_char() const
{
  return this->value;
}

int VariablePrimitiveInt::get_int() const
{
  return this->value;
}

long VariablePrimitiveInt::get_long() const
{
  return this->value;
}

float VariablePrimitiveInt::get_float() const
{
  return this->value;
}

double VariablePrimitiveInt::get_double() const
{
  return this->value;
}
}
