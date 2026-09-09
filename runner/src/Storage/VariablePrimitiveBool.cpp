#include "VariablePrimitiveBool.h"

namespace Storage
{
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
    return val(this->value);
  }
}