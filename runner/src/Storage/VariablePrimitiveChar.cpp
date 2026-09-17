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
  result.set("type", this->get_type_name());
  result.set("data", val(this->value));

  return result;
}

char VariablePrimitiveChar::get_value() const
{
  return this->value;
}

char VariablePrimitiveChar::get_char() const
{
  return this->value;
}

int VariablePrimitiveChar::get_int() const
{
  return this->value;
}

long long VariablePrimitiveChar::get_long() const
{
  return this->value;
}

float VariablePrimitiveChar::get_float() const
{
  return this->value;
}

double VariablePrimitiveChar::get_double() const
{
  return this->value;
}
}
