#include "VariablePrimitiveChar.h"

namespace Storage
{
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
    return val(this->value);
  }

  char VariablePrimitiveChar::get_value() const
  {
    return this->value;
  }
}