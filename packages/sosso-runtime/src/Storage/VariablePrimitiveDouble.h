#pragma once

#include "Variable.h"

namespace Storage {
class VariablePrimitiveDouble : public Variable {
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
  const Variable* operate_subtract(const Variable* right) const;

  private:
  double value;
};
}
