#include "LiteralDouble.h"
#include "extract.h"
#include "../Storage/VariablePrimitiveDouble.h"

namespace Binary
{
  LiteralDouble::LiteralDouble(char *binary, int offset)
  {
    this->end = offset + sizeof(double);
    this->value = (double *)extract(binary, offset, sizeof(double));
  }

  LiteralDouble::~LiteralDouble()
  {
    delete this->value;
  }

  const int LiteralDouble::get_end() const
  {
    return this->end;
  }

  const Variable *LiteralDouble::resolve(Closure *closure) const
  {
    return new VariablePrimitiveDouble(*this->value);
  }
}