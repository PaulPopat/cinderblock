#include "./Variable.h"
#include "./Frame.h"

namespace Storage
{
  class VariablePrimitiveInt : Variable
  {
  public:
    const static char TypeName = 4;
    VariablePrimitiveInt(int value);
    VariablePrimitiveInt(val value);

    const val raw() const;

  private:
    int value;
  };
}