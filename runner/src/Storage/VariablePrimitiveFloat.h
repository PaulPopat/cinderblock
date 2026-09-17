#pragma once

#include "VariableArithmetic.h"

namespace Storage {
class VariablePrimitiveFloat : public VariableArithmetic {
  public:
  static const VariablePrimitiveFloat* FromVariable(const Variable* var)
  {
    if (var->get_type_name() != VariablePrimitiveFloat::TypeName) {
      return nullptr;
    }

    return (VariablePrimitiveFloat*)var;
  }

  const static char TypeName = 3;
  const char IsType = 3;
  VariablePrimitiveFloat(float value);
  VariablePrimitiveFloat(val value);

  const char get_type_name() const
  {
    return VariablePrimitiveFloat::TypeName;
  }

  const val raw() const;
  float get_value() const;

  char get_char() const;
  int get_int() const;
  long long get_long() const;
  float get_float() const;
  double get_double() const;

  private:
  float value;
};
}
