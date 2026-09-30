#include "LiteralDouble.h"
#include "../Storage/VariablePrimitiveDouble.h"
#include "extract.h"

namespace Binary {
LiteralDouble::LiteralDouble(const char* binary, int offset)
{
  this->end = offset + sizeof(double);
  this->value = *extract<double>(binary, offset);
}

LiteralDouble::~LiteralDouble()
{
}

const int LiteralDouble::get_end() const
{
  return this->end;
}

const Variable* LiteralDouble::resolve(Closure* closure) const
{
  return closure->add_temp_variable(new VariablePrimitiveDouble(this->value));
}
}
