#include "ShapeArray.h"
#include "../Storage/VariableArray.h"

namespace Binary {
ShapeArray::ShapeArray(const char* binary, int offset)
{
  this->value = Shape::Parse(binary, offset);
  this->end = this->value->get_end();
}

ShapeArray::~ShapeArray()
{
  delete this->value;
}

const int ShapeArray::get_end() const
{
  return this->end;
}

const bool ShapeArray::matches(const Variable* subject) const
{
  auto possible = VariableArray::FromVariable(subject);
  if (possible == nullptr) {
    return false;
  }

  for (const auto& value : possible->get_values()) {
    if (!this->value->matches(value)) {
      return false;
    }
  }

  return true;
}
}
