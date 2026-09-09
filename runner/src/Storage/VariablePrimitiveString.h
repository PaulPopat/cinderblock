#pragma once

#include "Variable.h"
#include <string>

namespace Storage
{
  class VariablePrimitiveString : public Variable
  {
  public:
    static const VariablePrimitiveString *FromVariable(const Variable *var)
    {
      if (var->TypeName != VariablePrimitiveString::TypeName)
      {
        return nullptr;
      }

      return (VariablePrimitiveString *)var;
    }

    const static char TypeName = 6;
    const char TypeName = 6;
    VariablePrimitiveString(std::string value);
    VariablePrimitiveString(val value);

    const val raw() const;
    std::string get_value() const;

  private:
    std::string value;
  };
}