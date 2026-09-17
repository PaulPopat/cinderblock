#pragma once

#include "VariableArithmetic.h"

namespace Storage {
class VariablePrimitiveChar : public VariableArithmetic {
  public:
  static const VariablePrimitiveChar* FromVariable(const Variable* var)
  {
    if (var->get_type_name() != VariablePrimitiveChar::TypeName) {
      return nullptr;
    }

    return (VariablePrimitiveChar*)var;
  }

  const static char TypeName = 7;
  const char IsType = 7;
  VariablePrimitiveChar(char value);
  VariablePrimitiveChar(val value);

  const char get_type_name() const
  {
    return VariablePrimitiveChar::TypeName;
  }

  const val raw() const;
  char get_value() const;

  char get_char() const;
  int get_int() const;
  long long get_long() const;
  float get_float() const;
  double get_double() const;

  private:
  char value;
};
}
