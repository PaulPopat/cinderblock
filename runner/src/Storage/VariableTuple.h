#pragma once

#include "Variable.h"
#include "VariableTuplePart.h"
#include <vector>

namespace Storage {
class VariableTuple : public Variable {
  public:
  static const VariableTuple* FromVariable(const Variable* var)
  {
    if (var->get_type_name() != VariableTuple::TypeName) {
      return nullptr;
    }

    return (VariableTuple*)var;
  }

  const static char TypeName = 10;
  const char IsType = 10;
  VariableTuple();
  VariableTuple(const std::vector<VariableTuplePart>& value);
  VariableTuple(val value);
  ~VariableTuple();

  const char get_type_name() const
  {
    return VariableTuple::TypeName;
  }

  const VariableTuple* merge(const VariableTuple* input) const;
  const Variable* get(std::string name) const;
  const val raw() const;
  const std::vector<VariableTuplePart> get_parts() const;

  private:
  std::vector<VariableTuplePart> value;
};
}
