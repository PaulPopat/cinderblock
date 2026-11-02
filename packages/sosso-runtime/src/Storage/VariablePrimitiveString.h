#pragma once

#include "Variable.h"
#include <string>

namespace Storage {
class VariablePrimitiveString : public Variable {
  public:
  static const VariablePrimitiveString* FromVariable(const Variable* var)
  {
    if (var->get_type_name() != VariablePrimitiveString::TypeName) {
      return nullptr;
    }

    return (VariablePrimitiveString*)var;
  }

  const static char TypeName = 6;
  const char IsType = 6;
  VariablePrimitiveString(std::string value);
  VariablePrimitiveString(val value);

  const char get_type_name() const
  {
    return VariablePrimitiveString::TypeName;
  }

  const val raw() const;
  std::string get_value() const;
  std::string get_string() const;
  const Variable* operate_add(const Variable* right) const;
  const Variable* operate_in(const Variable* right) const;
  const Variable* operate_equals(const Variable* right) const;
  const Variable* operate_not_equals(const Variable* right) const;

  private:
  std::string value;
};
}
