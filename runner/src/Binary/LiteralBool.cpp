#include "./LiteralBool.h"

namespace Binary
{
  LiteralBool::LiteralBool(char *binary, int offset)
  {
    this->value = binary[offset] != 0;
    this->end = offset + 1;
  }

  const int LiteralBool::get_end() const
  {
    return this->end;
  }
}