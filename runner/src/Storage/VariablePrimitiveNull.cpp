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
  return val::null();
}
}
