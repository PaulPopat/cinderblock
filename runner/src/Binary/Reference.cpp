#include "Reference.h"
#include "../Storage/VariablePipeable.h"

namespace Binary {
Reference::Reference(const char* binary, int offset)
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
  auto result = closure->search(this->name->get_value());
  auto pipeable_result = VariablePipeable::FromVariable(result);
  if (pipeable_result != nullptr && pipeable_result->get_no_args()) {
    return pipeable_result->invoke(new VariableTuple());
  }

  return result;
}
}
