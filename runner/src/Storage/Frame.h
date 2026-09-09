#pragma once

#include "Variable.h"
#include "VariableTuplePart.h"
#include <vector>
#include <string>

namespace Storage
{
  class Frame
  {
  public:
    static Frame *From(val data);

    Frame();
    ~Frame();
    Variable *search(std::string name);
    Frame *add_variable(std::string name, Variable *value);
    Frame *merge(const Frame *input);

    const val raw() const;

  private:
    std::vector<VariableTuplePart> data;
  };
}