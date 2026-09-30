#include "ShapeChar.h"
#include "../Storage/VariablePrimitiveChar.h"

namespace Binary {
ShapeChar::ShapeChar(const char* binary, int offset)
{
  this->end = offset;
}

ShapeChar::~ShapeChar()
{
}

const int ShapeChar::get_end() const
{
  return this->end;
}

const bool ShapeChar::matches(const Variable* subject) const
{
  auto possible = VariablePrimitiveChar::FromVariable(subject);
  if (possible == nullptr) {
    return false;
  }

  return true;
}
}
