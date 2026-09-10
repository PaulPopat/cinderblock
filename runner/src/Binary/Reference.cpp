#include "Reference.h"

namespace Binary {
Reference::Reference(const char*binary, int offset)
{
  this->name = new LiteralString(binary, offset);
  this->end = this->name->get_end();
}

Reference::~Reference()
{
  delete this->name;
}

const int Reference::get_end() const
{
  return this->end;
}

const Variable* Reference::resolve(Closure* closure) const
{
  return closure->search(this->name->get_value());
}
}
