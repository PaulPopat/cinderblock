#include "./LiteralNull.h"
#include "./extract.h"

namespace Binary
{
  LiteralNull::LiteralNull(char *binary, int offset)
  {
    this->end = offset;
  }

  const int LiteralNull::get_end() const
  {
    return this->end;
  }
}