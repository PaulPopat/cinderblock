#pragma once

#include "VariableArithmetic.h"

namespace Storage {
class VariablePrimitiveLong : public VariableArithmetic {
  public:
  static const VariablePrimitiveLong* FromVariable(const Variable* var)
  {
    if (var->get_type_name() != VariablePrimitiveLong::TypeName) {
      return nullptr;
    }

    return (VariablePrimitiveLong*)var;
  }

  const static char TypeName = 8;
  const char IsType = 8;
  VariablePrimitiveLong(long long value);
  VariablePrimitiveLong(val value);

  const char get_type_name() const
  {
    return VariablePrimitiveLong::TypeName;
  }

  const val raw() const;
  long long get_value() const;

  char get_char() const;
  int get_int() const;
  long long get_long() const;
  float get_float() const;
  double get_double() const;

  private:
  long long value;
};
}
