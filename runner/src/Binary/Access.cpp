#include "Access.h"
#include "../Storage/VariablePrimitiveNull.h"
#include "../Storage/VariableTuple.h"

using namespace Storage;

namespace Binary {
Access::Access(const char*binary, int offset)
{
  this->subject = Instruction::Parse(binary, offset);
  this->key = new LiteralString(binary, this->subject->get_end());
  this->end = this->key->get_end();
}

Access::~Access()
{
  delete this->subject;
  delete this->key;
}

const int Access::get_end() const
{
  return this->end;
}

const Variable* Access::resolve(Closure* closure) const
{
  auto subject = VariableTuple::FromVariable(this->subject->resolve(closure));
  if (subject == nullptr) {
    return closure->add_temp_variable(new VariablePrimitiveNull());
  }

  return subject->get(this->key->get_value());
}
}
