#pragma once

#include "Variable.h"
#include <string>

namespace Storage {
class VariablePrimitiveString : public Variable {
  public:
  static const VariablePrimitiveString* FromVariable(const Variable* var)
  {
    if (var->IsType != VariablePrimitiveString::TypeName) {
      return nullptr;
    }

    return (VariablePrimitiveString*)var;
  }

  const static char TypeName = 6;
  const char IsType = 6;
  VariablePrimitiveString(std::string value);
  VariablePrimitiveString(val value);

  const val raw() const;
  std::string get_value() const;

  private:
  std::string value;
};
}
