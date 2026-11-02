#include "External.h"

namespace Binary {
External::External(const char*binary, int offset)
{
  this->name = new LiteralString(binary, offset);
  this->end = this->name->get_end();
}

External::~External()
{
  delete this->name;
}

const int External::get_end() const
{
  return this->end;
}

const Variable* External::resolve(Closure* closure) const
{
  return closure->search_global(this->name->get_value());
}
}
