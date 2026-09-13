#pragma once

#include "VariableArithmetic.h"

namespace Storage {
class VariablePrimitiveInt : public VariableArithmetic {
  public:
  static const VariablePrimitiveInt* FromVariable(const Variable* var)
  {
    if (var->get_type_name() != VariablePrimitiveInt::TypeName) {
      return nullptr;
    }

    return (VariablePrimitiveInt*)var;
  }

  const static char TypeName = 4;
  const char IsType = 4;
  VariablePrimitiveInt(int value);
  VariablePrimitiveInt(val value);

  const char get_type_name() const
  {
    return VariablePrimitiveInt::TypeName;
  }

  const val raw() const;
  int get_value() const;

  char get_char() const;
  int get_int() const;
  long get_long() const;
  float get_float() const;
  double get_double() const;

  private:
  int value;
};
}
