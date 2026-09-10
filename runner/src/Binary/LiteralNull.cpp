#include "LiteralNull.h"
#include "../Storage/VariablePrimitiveNull.h"
#include "extract.h"

namespace Binary {
LiteralNull::LiteralNull(char* binary, int offset)
{
  this->end = offset;
}

const int LiteralNull::get_end() const
{
  return this->end;
}

const Variable* LiteralNull::resolve(Closure* closure) const
{
  return closure->add_temp_variable(new VariablePrimitiveNull());
}
}
