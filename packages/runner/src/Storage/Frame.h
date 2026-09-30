#pragma once

#include "Variable.h"
#include "VariableTuplePart.h"
#include <string>
#include <vector>

namespace Storage {
class Frame {
  public:
  static Frame* From(val data);

  Frame();
  ~Frame();
  const Variable* search(std::string name) const;
  Frame* add_variable(std::string name, const Variable* value);
  Frame* add_temp_variable(const Variable* value);
  Frame* merge(const Frame* input);

  const val raw() const;

  private:
  std::vector<VariableTuplePart>* data;
  std::vector<const Variable*>* temp;
};
}
