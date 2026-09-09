#pragma once

#include "Variable.h"
#include "VariableTuplePart.h"
#include <vector>

namespace Storage
{
  class VariableTuple : public Variable
  {
  public:
    static const VariableTuple *FromVariable(const Variable *var)
    {
      if (var->TypeName != VariableTuple::TypeName)
      {
        return nullptr;
      }

      return (VariableTuple *)var;
    }

    const static char TypeName = 10;
    const char TypeName = 10;
    VariableTuple(std::vector<VariableTuplePart> value);
    VariableTuple(val value);
    ~VariableTuple();

    const VariableTuple *merge(const VariableTuple *input) const;
    const Variable *get(std::string name) const;
    const val raw() const;

  private:
    std::vector<VariableTuplePart> value;
  };
}