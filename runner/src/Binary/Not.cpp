#include "Not.h"
#include "../Storage/VariablePrimitiveBool.h"

namespace Binary {
Not::Not(const char* binary, int offset)
{
  this->subject = Instruction::Parse(binary, offset);
  this->end = this->subject->get_end();
}

Not::~Not()
{
  delete this->subject;
}

const int Not::get_end() const
{
  return this->end;
}

const Variable* Not::resolve(Closure* closure) const
{
  return closure->add_temp_variable(new VariablePrimitiveBool(!this->subject->resolve(closure)->get_bool()));
}
}
