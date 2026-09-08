#include "./External.h"

namespace Binary
{
  External::External(char *binary, int offset)
  {
    this->name = new LiteralString(binary, offset);
    this->end = this->name->get_end();
  }

  const int External::get_end() const
  {
    return this->end;
  }
}