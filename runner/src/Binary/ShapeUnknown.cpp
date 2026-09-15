#include "ShapeUnknown.h"

namespace Binary {
ShapeUnknown::ShapeUnknown(const char* binary, int offset)
{
  this->end = offset;
}

ShapeUnknown::~ShapeUnknown()
{
}

const int ShapeUnknown::get_end() const
{
  return this->end;
}

const bool ShapeUnknown::matches(const Variable* subject) const
{
  return true;
}
}
