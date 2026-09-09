#include "./Variable.h"
#include "./Frame.h"

namespace Storage
{
  class VariablePrimitiveFloat : Variable
  {
  public:
    const static char TypeName = 3;
    VariablePrimitiveFloat(float value);
    VariablePrimitiveFloat(val value);

    const val raw() const;

  private:
    float value;
  };
}