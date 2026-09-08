#include "./LiteralDouble.h"
#include "./extract.h"

namespace Binary
{
  LiteralDouble::LiteralDouble(char *binary, int offset)
  {
    this->end = offset + sizeof(double);
    this->value = (double *)extract(binary, offset, sizeof(double));
  }

  const int LiteralDouble::get_end() const
  {
    return this->end;
  }
}