#include "ShapeArg.h"
#include "extract.h"
#include "../Storage/VariablePrimitiveString.h"

namespace Binary {
ShapeArg::ShapeArg(const char* binary, int offset)
{
  this->name = new LiteralString(binary, offset);
  this->type = Shape::Parse(binary, this->name->get_end());
  this->end = this->type->get_end();
}

ShapeArg::~ShapeArg()
{
}

const int ShapeArg::get_end() const
{
  return this->end;
}

const bool ShapeArg::matches(const Variable* subject) const
{
  return true;
}
}
