#pragma once

#include "Variable.h"

namespace Storage {
class VariablePrimitiveChar : public Variable {
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

  const Variable* operate_add(const Variable* right) const;
  const Variable* operate_divide(const Variable* right) const;
  const Variable* operate_equals(const Variable* right) const;
  const Variable* operate_greater_than(const Variable* right) const;
  const Variable* operate_greater_than_or_equal_to(const Variable* right) const;
  const Variable* operate_less_than(const Variable* right) const;
  const Variable* operate_less_than_or_equal_to(const Variable* right) const;
  const Variable* operate_multiply(const Variable* right) const;
  const Variable* operate_not_equals(const Variable* right) const;
  const Variable* operate_modulo(const Variable* right) const;
  const Variable* operate_subtract(const Variable* right) const;

  private:
  char value;
};
}
