#include "Arg.h"

namespace Binary
{
  Arg::Arg(char *binary, int offset)
  {
    this->name = new LiteralString(binary, offset);
    this->end = this->name->get_end();
  }

  Arg::~Arg()
  {
    delete this->name;
  }

  const int Arg::get_end() const
  {
    return this->end;
  }

  const Storage::Variable *Arg::resolve(Storage::Closure *closure) const
  {
    return closure->search(this->name->get_value());
  }
}