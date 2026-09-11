#include "VariablePrimitiveNull.h"

namespace Storage {
VariablePrimitiveNull::VariablePrimitiveNull()
{
}

VariablePrimitiveNull::VariablePrimitiveNull(val value)
{
  if (!value.isNull()) {
    throw "Null expected";
  }
}

const val VariablePrimitiveNull::raw() const
{
  auto result = val::object();
  result.set("type", this->IsType);
  result.set("data", val::null());

  return result;
}
}
