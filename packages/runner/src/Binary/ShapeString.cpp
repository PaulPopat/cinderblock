#include "ShapeString.h"
#include "../Storage/VariablePrimitiveString.h"

namespace Binary {
ShapeString::ShapeString(const char* binary, int offset)
{
  this->end = offset;
}

ShapeString::~ShapeString()
{
}

const int ShapeString::get_end() const
{
  return this->end;
}

const bool ShapeString::matches(const Variable* subject) const
{
  auto possible = VariablePrimitiveString::FromVariable(subject);
  if (possible == nullptr) {
    return false;
  }

  return true;
}
}
