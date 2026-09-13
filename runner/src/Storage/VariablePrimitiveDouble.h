#pragma once

#include "VariableArithmetic.h"

namespace Storage {
class VariablePrimitiveDouble : public VariableArithmetic {
  public:
  static const VariablePrimitiveDouble* FromVariable(const Variable* var)
  {
    if (var->get_type_name() != VariablePrimitiveDouble::TypeName) {
      return nullptr;
    }

    return (VariablePrimitiveDouble*)var;
  }

  const static char TypeName = 9;
  const char IsType = 9;
  VariablePrimitiveDouble(double value);
  VariablePrimitiveDouble(val value);

  const char get_type_name() const
  {
    return VariablePrimitiveDouble::TypeName;
  }

  const val raw() const;
  double get_value() const;

  char get_char() const;
  int get_int() const;
  long get_long() const;
  float get_float() const;
  double get_double() const;

  private:
  double value;
};
}
