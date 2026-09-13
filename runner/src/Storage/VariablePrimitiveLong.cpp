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
  auto result = val::object();
  result.set("type", this->get_type_name());
  result.set("data", val(this->value));

  return result;
}

long VariablePrimitiveLong::get_value() const
{
  return this->value;
}

char VariablePrimitiveLong::get_char() const
{
  return this->value;
}

int VariablePrimitiveLong::get_int() const
{
  return this->value;
}

long VariablePrimitiveLong::get_long() const
{
  return this->value;
}

float VariablePrimitiveLong::get_float() const
{
  return this->value;
}

double VariablePrimitiveLong::get_double() const
{
  return this->value;
}
}
