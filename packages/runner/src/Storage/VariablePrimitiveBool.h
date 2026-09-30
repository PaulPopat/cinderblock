#pragma once

#include "Variable.h"

namespace Storage {
class VariablePrimitiveBool : public Variable {
  public:
  static const VariablePrimitiveBool* FromVariable(const Variable* var)
  {
    if (var->get_type_name() != VariablePrimitiveBool::TypeName) {
      return nullptr;
    }

    return (VariablePrimitiveBool*)var;
  }

  const static char TypeName = 2;
  VariablePrimitiveBool(bool value);
  VariablePrimitiveBool(val value);

  const char get_type_name() const
  {
    return VariablePrimitiveBool::TypeName;
  }

  bool get_bool() const;
  const val raw() const;
  bool get_value() const;
  const Variable* operate_and(const Variable* right) const;
  const Variable* operate_equals(const Variable* right) const;
  const Variable* operate_not_equals(const Variable* right) const;
  const Variable* operate_or(const Variable* right) const;

  private:
  bool value;
};
}
