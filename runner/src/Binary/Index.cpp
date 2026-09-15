#include "Index.h"
#include "../Storage/VariableArray.h"
#include "../Storage/VariablePrimitiveNull.h"
#include "../Storage/VariableArithmetic.h"
#include "extract.h"

using namespace Storage;

namespace Binary {
Index::Index(const char* binary, int offset)
{
  this->index = Instruction::Parse(binary, offset);
  this->subject = Instruction::Parse(binary, this->index->get_end());
  this->end = this->subject->get_end();
}

Index::~Index()
{
}

const int Index::get_end() const
{
  return this->end;
}

const Variable* Index::resolve(Closure* closure) const
{
  auto subject = VariableArray::FromVariable(this->subject->resolve(closure));
  if (subject == nullptr) {
    return closure->add_temp_variable(new VariablePrimitiveNull());
  }

  auto index = VariableArithmetic::FromVariable(this->index->resolve(closure))->get_int();
  auto subject_values = subject->get_values();
  if (index >= subject_values.size()) {
    return closure->add_temp_variable(new VariablePrimitiveNull());
  }

  return subject_values[index];
}
}
