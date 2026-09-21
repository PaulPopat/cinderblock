#include "VariablePrimitiveNull.h"
#include "../CinderblockException.h"
#include "VariablePrimitiveBool.h"

namespace Storage {
VariablePrimitiveNull::VariablePrimitiveNull()
{
}

VariablePrimitiveNull::VariablePrimitiveNull(val value)
{
  if (!value.isNull()) {
    throw CinderblockException("Null expected");
  }
}

const val VariablePrimitiveNull::raw() const
{
  auto result = val::object();
  result.set("type", this->get_type_name());
  result.set("data", val::null());

  return result;
}

const Variable* VariablePrimitiveNull::operate_equals(const Variable* right) const
{
  return new VariablePrimitiveBool(right->get_type_name() == VariablePrimitiveNull::TypeName);
}

const Variable* VariablePrimitiveNull::operate_not_equals(const Variable* right) const
{
  return new VariablePrimitiveBool(right->get_type_name() != VariablePrimitiveNull::TypeName);
}
}
